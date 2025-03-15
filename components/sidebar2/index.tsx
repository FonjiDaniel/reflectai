// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// import Image from "next/image"
// import logo from "@/public/icon.png"

// // Menu items.
// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ]

// export function AppSidebar() {
//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem key="Reflect" className="flex gap-2">
//             <Avatar>
//               <AvatarImage className="h-6 w-6" src="https://res.cloudinary.com/dwg1nr3cj/image/upload/v1741961733/reflectai%20Images/Untitled%20design%20%289%29.png" />
//             </Avatar>

//             <span>Reflect</span>
//           </SidebarMenuItem>
//         </SidebarMenu>
//         <div className="flex justify-start gap-2">
//           <Image className="rounded-md " src={logo} alt="logo" height={20} width={20} />
//           <div>
//             <p>Reflect</p>
//           </div>

//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }
