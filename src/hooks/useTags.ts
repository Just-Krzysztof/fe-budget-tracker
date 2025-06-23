import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi, type Tag } from '../api/tags.api';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useTags = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: tags = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn:() => tagsApi.getTags(() => navigate('/login')),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });

  const createTag = useMutation({
    mutationFn: (tagData) => {
      if (!user?.id) throw new Error('User is not authenticated');
      return tagsApi.createTag({ ...tagData, userId: user.id });
    },
    onSuccess: (newTag) => {
      queryClient.setQueryData(
        ['tags', user?.id],
        (oldData?: { tags: Tag[] }) => ({
          ...(oldData ?? { tags: [] }),
          tags: [...(oldData?.tags ?? []), newTag],
        })
      );
    },
  });

  return {
    tags,
    isLoading,
    error,
    refetch,
    createTag: createTag.mutateAsync,
    isCreating: createTag.isPending,
  };
};
