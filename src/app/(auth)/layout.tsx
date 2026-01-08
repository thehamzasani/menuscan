// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 px-4">
//       <div className="w-full max-w-md">
//         {children}
//       </div>
//     </div>
//   )
// }

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}