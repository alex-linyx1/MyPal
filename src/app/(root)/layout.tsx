import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const RootLayout = ({
   children 
}: {
   children: React.ReactNode; 
}) => {
    return ( 
      <div className="h-full flex">
         <div className="hidden md:flex mt-16 ml-0 w-20 fixed inset-y-0">
            <Sidebar />
         </div>
         <div className="flex flex-col flex-1">
         <Navbar />
         <main className="pl-44 pt-24 h-full">
            {children}
         </main>
         </div>
      </div>
     );
}
 
export default RootLayout;