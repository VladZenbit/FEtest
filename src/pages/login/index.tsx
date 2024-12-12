import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Checkbox, FormControlLabel, OutlinedInput, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';

import { PrimaryBtn } from 'src/common/components/buttons';
import FormProvider from 'src/common/components/hook-form/form-provider';
import { Colors } from 'src/common/theme';
import { Path } from 'src/routing';
import { setToken } from 'src/store/features/auth/authSlice';
import { useAppDispatch } from 'src/store/hooks';
import { useLoginMutation } from 'src/store/services/auth/authApi';

import { ILoginForm, loginFormSchema } from '../../validation/login/validation';

export default function LoginPage(): JSX.Element {
  const navigate = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const methods = useForm<ILoginForm>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    mode: 'onTouched'
  });

  const { handleSubmit, reset, setValue } = methods;

  const onSubmit = async (values: ILoginForm): Promise<void> => {
    try {
      const { accessToken } = await login({
        email: values.email.toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe || false
      }).unwrap();

      dispatch(
        setToken({
          token: accessToken
        })
      );

      navigate.push(Path.DASHBOARD);

      toast.success(t('login.loginSuccess'));
      reset();
    } catch (error) {
      toast.error(t('login.loginFailed'));
    }
  };

  return (
    <>
      <Typography variant="h1" marginBottom="40px">
        {t('login.mainText')}
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap="24px" width="300px">
          <OutlinedInput
            name="email"
            type="email"
            autoComplete="off"
            placeholder="Email"
            sx={{
              borderRadius: '10px',
              background: Colors.INPUT,
              color: Colors.WHITE,
              '&::placeholder': {
                color: Colors.WHITE
              }
            }}
            onChange={(e) => setValue('email', e.target.value)}
          />

          <OutlinedInput
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Password"
            sx={{
              borderRadius: '10px',
              background: Colors.INPUT,
              color: Colors.WHITE,
              '&::placeholder': {
                color: Colors.WHITE
              }
            }}
            onChange={(e) => setValue('password', e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                onChange={(e) => setValue('rememberMe', e.target.checked)}
              />
            }
            label="Remember Me"
            name="rememberMe"
            sx={{ color: Colors.WHITE, mx: 'auto' }}
          />

          <PrimaryBtn
            width="100%"
            loading={isLoading}
            disabled={isLoading}
            text={t('login.btn')}
            type="submit"
          />
        </Box>
      </FormProvider>
    </>
  );
}
