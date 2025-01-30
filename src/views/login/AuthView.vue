<script setup>
</script>

<template>
<section class="d-block d-md-flex dart-pointer" style="">
    <article class="justify-content-center m-auto col-8 col-md-6 col-xl-3" style="background: transparent!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);">
      <RouterView />
    </article>
</section>
<footer class="position-absolute bottom-0 pb-3 w-100" style="background: linear-gradient(90deg, rgba(20,0,36,.01) 0%, rgba(45,171,228,.1) 50%, rgba(1,212,255,.01) 100%);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);">
  <article class="container fw-bold text-light">
      Pars Border Service!
  </article>
</footer>
</template>

<style scoped>
.dart-pointer{
  flex-grow: 1;
    display: flex;
    width: 100%;
    height: 100%;
    --d: 1px;
    background: radial-gradient( circle at var(--d) var(--d), #000 calc(var(--d) - 1px), #0000 var(--d) ) 0 0 / 20px 20px;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
}
</style>