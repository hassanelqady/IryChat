export async function exchangeForLongLivedToken(shortLivedToken: string) {
  const response = await fetch(
    'https://graph.facebook.com/oauth/access_token' +
    '?grant_type=fb_exchange_token' +
    '&client_id=' + process.env.NEXT_PUBLIC_META_APP_ID +
    '&client_secret=' + process.env.META_APP_SECRET +
    '&fb_exchange_token=' + shortLivedToken
  )
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data
}

export async function getPageToken(longLivedUserToken: string, pageId: string) {
  const response = await fetch(
    'https://graph.facebook.com/' + pageId +
    '?fields=access_token&access_token=' + longLivedUserToken
  )
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.access_token as string
}

export async function getInstagramAccountId(pageId: string, pageToken: string) {
  const response = await fetch(
    'https://graph.facebook.com/' + pageId +
    '?fields=instagram_business_account&access_token=' + pageToken
  )
  const data = await response.json()
  return data.instagram_business_account?.id as string | undefined
}

export async function getUserPages(longLivedToken: string) {
  const response = await fetch(
    'https://graph.facebook.com/me/accounts?fields=id,name,picture&access_token=' + longLivedToken
  )
  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.data as { id: string; name: string; picture?: any }[]
}
