export default defineNuxtRouteMiddleware((to) => {
  const slug = to.params.guest as string | undefined;

  if (!slug || slug.trim() === "") {
    return navigateTo("/");
  }

  if (!/^[a-z-]+$/.test(slug)) {
    return navigateTo("/");
  }
});
