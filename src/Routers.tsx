import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import SolanaBoard from "./features/solana/SolanaBoard";
import CosmWasmBoard from "./features/cosmwasm/CosmWasmBoard";

function DynamicRouter() {
  const routerData: RouteObject[] = [
    { path: "/solana", element: <SolanaBoard name="basic" /> },
    { path: "/solana/basic", element: <SolanaBoard name="basic" /> },
    { path: "/solana/counter", element: <SolanaBoard name="counter" /> },
    { path: "/solana/escrow", element: <SolanaBoard name="escrow" /> },
    { path: "/cosmwasm", element: <CosmWasmBoard /> },
  ];

  return useRoutes(routerData);
}

function Routers() {
  return <DynamicRouter />;
}

export default Routers;
