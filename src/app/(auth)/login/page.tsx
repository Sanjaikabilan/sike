'use client';
import { useRouter } from 'next/navigation'
import React, { use, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "@/../public/cypresslogo.svg";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';
import { actionLoginUser } from '@/lib/server-actions/auth-actions';

const LoginPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState('');
    const form = useForm<z.infer<typeof FormSchema>>({
        mode : 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email : '',
            password : '',
        },
    });

const isLoading = form.formState.isSubmitting;

const onSubmit : SubmitHandler<z.infer<typeof FormSchema>> = async(
    formData
) => {
    const {error} = await actionLoginUser(formData);
    if (error) {
        form.reset();
        setSubmitError(error.message);
    }
    router.replace('/dashboard');
};

  return <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
    onChange={() => {
        if (submitError) setSubmitError('');
    }}
    className=' w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col ' >
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
    {submitError && <FormMessage>{submitError}</FormMessage>}
    <Button 
    type='submit'
    className=' w-full p-6'
    size="lg"
    disabled={isLoading} >
        {!isLoading ? "Login" : <Loader/>}
    </Button>
    <span className=' self-container' >
        Dont Have an Account?
        <Link
         href="/signup"
         className=' text-primary' > Sign up</Link>
    </span>
    </form>
  </Form>
}

export default LoginPage