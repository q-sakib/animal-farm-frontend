import AssetsGallery from "@/components/Gallery"; // Adjusted import
// import dynamic from 'next/dynamic'
// 'use client'
// import AssetsGallery from "../components/Gallery"; // Adjusted import
 
// const AssetsGallery = dynamic(() => import('../components/Gallery'), { ssr: false })
 
export default function Home() {
  return (
    <>
      
      <AssetsGallery />
      {/* <AssetsGallery initialCategories={[]} initialAnimals={[]} /> */}
    </>
  );
}
