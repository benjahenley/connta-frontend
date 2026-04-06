"use client";

import Layout from "@/components/layouts/Home";
import NavbarPublic from "@/components/navigation/NavbarPublic";
import HomePage from "@/components/pages/Home";

export default function Home() {
  return (
    <>
      <NavbarPublic />
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
}
