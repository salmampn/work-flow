function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div>{children}</div>
    </div>
  );
}
export default HomeLayout;
