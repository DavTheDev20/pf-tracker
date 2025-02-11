import { ReactNode, useContext } from "react";
import AuthContext from "./AuthContext";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  // @ts-expect-error this is the proper use
  const { user, loading } = useContext<object>(AuthContext);
  if (loading) return <p>Loading...</p>;

  return user ? children : null;
}
