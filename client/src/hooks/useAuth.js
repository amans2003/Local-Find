import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export function useLogin() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: ({ data }) => {
      setUser(data.data.user, data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate('/');
    },
  });
}
