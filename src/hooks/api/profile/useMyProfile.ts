import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';

export type MyProfileResponse = {
  code: string;
  message: string;
  data: {
    userId: number;
    nickName: string;
    gender: string;
    profileImage: string;
    birthdate: string;
    favoriteGenres: string[];
    introduce: string;
    latitude: number;
    longitude: number;
    searchRadius: number;
    lifeMovie: string;
    watchedMovies: string[];
    preferredTheaters: string[];
    createdAt: string;
    modifiedAt: string;
  };
};

export function useMyProfile() {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const { data } = await apiClient.get<MyProfileResponse>(
        '/api/profile/profile/me'
      );
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
}
