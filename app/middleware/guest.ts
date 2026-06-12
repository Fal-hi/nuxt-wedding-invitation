export default defineNuxtRouteMiddleware((to) => {
  const slug = to.params.guest as string | undefined;

  if (!slug || slug.trim() === "") {
    return navigateTo("/");
  }

  const normalized = slug.toLowerCase().trim();

  if (normalized !== slug) {
    return navigateTo(`/${normalized}`);
  }
});
