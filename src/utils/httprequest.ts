const baseAddress = "https://localhost:5057";

const httpRequest = async (
  url: string,
  data: any,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
) => {
  const response =
    method == "GET"
      ? await fetch(`${baseAddress}${url}`)
      : await fetch(`${baseAddress}${url}`, {
          method: method,
          body: JSON.stringify(data ?? {}),
          headers: {
            "Content-Type": "application/json",
          },
        });

  if (!response.ok) {
    const error = new Error("An error occured while posting to url:" + url);
    error.code = response.status;
    error.info = await response.json();

    throw error;
  }

  return await response.json();
};

export const GetRequest = async (url: string) => {
  return await httpRequest(url, undefined, "GET");
};

export const PostRequest = async (url: string, data: any) => {
  return await httpRequest(url, data, "POST");
};

export const PutRequest = async (url: string, data: any) => {
  return await httpRequest(url, data, "PUT");
};

export const PatchRequest = async (url: string, data: any) => {
  return await httpRequest(url, data, "PATCH");
};

export const DeleteRequest = async (url: string) => {
  return await httpRequest(url, {}, "DELETE");
};
