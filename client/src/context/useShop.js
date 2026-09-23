import { useContext } from "react";
import { ShopContext } from "./shopContextValue";

export function useShop() {
  return useContext(ShopContext);
}