import {
    TypedUseSelectorHook,
    useDispatch,
    useSelector
} from "react-redux";
import { StoreDispatch, StoreState } from "./store";

export const useAppDispatch: StoreDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;
