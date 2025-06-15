import { Outlet } from "react-router-dom"
import SessionHeader from "../components/SessionHeader"

export default function AdminLayout() {
  return (
    <>
      <SessionHeader />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}
