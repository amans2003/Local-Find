import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../utils/api';

export function useSearchListings(params) {
  return useQuery({
    queryKey: ['listings', 'search', params],
    queryFn: () => api.get('/listings/search', { params }).then((r) => r.data),
    enabled: Object.values(params).some(Boolean),
    keepPreviousData: true,
  });
}

export function useListing(slug) {
  return useQuery({
    queryKey: ['listing', slug],
    queryFn: () => api.get(`/listings/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useNearbyListings(coords) {
  return useQuery({
    queryKey: ['listings', 'nearby', coords],
    queryFn: () => api.get('/listings/nearby', { params: coords }).then((r) => r.data.data),
    enabled: !!(coords?.lat && coords?.lng),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, isBookmarked }) =>
      isBookmarked
        ? api.delete(`/users/bookmarks/${listingId}`)
        : api.post(`/users/bookmarks/${listingId}`),
    onSuccess: (_, { isBookmarked }) => {
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
    staleTime: Infinity,
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => api.get('/cities').then((r) => r.data.data),
    staleTime: Infinity,
  });
}
