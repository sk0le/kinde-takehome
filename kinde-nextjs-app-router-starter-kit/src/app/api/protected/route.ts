import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

async function getToken() {
  try {
    const response = await fetch(`${process.env.KINDE_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KINDE_MANAGEMENT_CLIENT_ID as string,
        client_secret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET as string,
        audience: `${process.env.KINDE_DOMAIN}/api`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.access_token;
  } catch (error) {
    console.error(error.message);
  }
}

async function getOrganizations() {
  const token = await getToken();

  const options = {
    method: "GET",
    url: `${process.env.KINDE_DOMAIN}/api/v1/organizations`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data.organizations;
  } catch (error) {
    console.error(error);
  }
}

export async function GET() {
  const {
    isAuthenticated,
  } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const organizations = await getOrganizations();
    const data = { organizations };
    return NextResponse.json({
      status: "success",
      message: "Successufully got organizations",
      data,
    });
  } catch (error) {
    return new Response("failed", { status: 400 });
  }
}
