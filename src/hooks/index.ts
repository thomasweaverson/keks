import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { TAppDispatch, TState } from '../types/state';

export const useAppDispatch = () => useDispatch<TAppDispatch>();

export const useAppSelector: TypedUseSelectorHook<TState> = useSelector;
