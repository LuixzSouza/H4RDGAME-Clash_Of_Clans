const BASE_URL = "https://api.clashofclans.com/v1";

export async function fetchClanData() {
  const clanTag = process.env.NEXT_PUBLIC_CLAN_TAG?.replace("#", "%23");
  const token = process.env.COC_API_TOKEN;

  if (!token) {
    console.error("TOKEN da API não encontrado no .env");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/clans/${clanTag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro API Clash (${response.status}):`, errorText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro de conexão com API do Clash:", error);
    return null;
  }
}