import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi, type Tag } from '../api/tags.api';

export const useTags = () => {
  const queryClient = useQueryClient();

  const {
    data: tags = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getTags,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });

  const createTag = useMutation({
    mutationFn: tagsApi.createTag,
    onSuccess: (newTag) => {
      queryClient.setQueryData(['tags'], (oldData?: { tags: Tag[] }) => ({
        ...(oldData ?? { tags: [] }),
        tags: [...(oldData?.tags ?? []), newTag],
      }));
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
