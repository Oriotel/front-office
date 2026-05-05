import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => (
  <AuthLayout
    title="Demande d'accès"
    subtitle="Soumettez votre demande pour accéder à la plateforme Oriotel."
  >
    <RegisterForm />
  </AuthLayout>
);

export default RegisterPage;
