"use client";
import { CreateOrgLink } from "@kinde-oss/kinde-auth-nextjs";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/protected")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="container">
      <div className="card start-hero">
        <p className="text-body-2 start-hero-intro">Woohoo!</p>
        <p className="text-display-2">
          Your authentication is all sorted.
          <br />
          Build the important stuff.
        </p>
      </div>
      <section className="next-steps-section">
        <CreateOrgLink orgName="Hurlstone">Create org</CreateOrgLink>
        {data.data.organizations.map((v, i: number) => (
          <p key={i}>{v.name}</p>
        ))}
      </section>
    </div>
  );
}
