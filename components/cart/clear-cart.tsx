"use client";

import { useEffect } from "react";
import { clearCartCookie } from "./actions";

export function ClearCart() {
  useEffect(() => {
    clearCartCookie();
  }, []);

  return null;
}
