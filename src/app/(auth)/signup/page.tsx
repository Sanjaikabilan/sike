'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '@/../public/cypresslogo.svg'
import Loader from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';
import { FormSchema } from '@/lib/types';
import { actionSignUpUser } from '@/lib/server-actions/auth-actions';

const SignupFormSchema = z.object({
    email: z.string().describe('Email').email({message:"Invalid Email"}),
    password: z.string().describe('Password').min(6,"Password must be minimum 6 chars"),
    confirmPassword: z.string().describe('Password').min(6,"Password must be minimum 6 chars"),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ['confirmPassword']

});


const Signup = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState('');
    const [confirmation, setConfirmation] = useState(false);

    const codeExchangeError = useMemo(() => {
        if (!searchParams) return "";
        return searchParams.get('error_description');
    }, [searchParams])

    const confirmationAndErrorStyles = useMemo(
        () =>
        clsx('bg-primary', {
            'bg-red-500/10': codeExchangeError,
            'border-red-500/50': codeExchangeError,
            'text-red-700': codeExchangeError,
        }),
        [codeExchangeError]
    );


    const form =  useForm<z.infer<typeof SignupFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {email: '', password: '' , confirmPassword: ''}
    });

    const onSubmit = async ({email,password}: z.infer<typeof FormSchema>) => {
      const {error} = await actionSignUpUser({email, password});
      if (error) {
        setSubmitError(error.message)
        form.reset();
        return;
      }
      setConfirmation(true);
    };

    const isLoading = form.formState.isSubmitting;


    return (
        <Form {...form}>
            <form 
            onChange={() => {if(submitError)setSubmitError("")}}
            onSubmit={form.handleSubmit(onSubmit)}
            className=' w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col' >
                <Link 
                href="/"
                className=' w-full flex justify-left items-center'
                >
                    <Image src={Logo} alt='cypress logo' width={50} height={50}></Image>
                    <span className=' font-semibold dark:text-white text-4xl ml-2' >cypress.</span>
                </Link>
                <FormDescription className=' text-foreground/60'>
                All in one collaborative workspace for developers.
                </FormDescription>
                {!confirmation && !codeExchangeError && <>
                    <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <Button type='submit' className=' w-full p-6 ' disabled={isLoading}  >
                    {!isLoading ? "Create Account" : <Loader/>}
                </Button>
                </>} 
                <span className=' self-container' >
                    Already Have an Account?
                    <Link
                    href="/login"
                    className=' text-primary' > Login</Link>
                </span>

                    {(confirmation || codeExchangeError ) && <>
                    <Alert className={confirmationAndErrorStyles} >
                        {!codeExchangeError && <MailCheck className=' h-4 w-4 ' />}
                        <AlertTitle>
                            {codeExchangeError? "Invalid Link" : "Check your Email"}
                        </AlertTitle>
                        <AlertDescription>
                            {codeExchangeError || 'An Email Confirmation has been sent'}
                        </AlertDescription>
                    </Alert>
                    </>}
            </form>
        </Form>
    )

}

export default Signup