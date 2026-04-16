<template>
  <div class="cloud-parallax-container" aria-hidden="true">
    <!-- Left side clouds -->
    <div class="cloud cloud-left cloud-1"></div>
    <div class="cloud cloud-left cloud-2"></div>
    <div class="cloud cloud-left cloud-3"></div>
    <div class="cloud cloud-left cloud-4"></div>

    <!-- Right side clouds -->
    <div class="cloud cloud-right cloud-5"></div>
    <div class="cloud cloud-right cloud-6"></div>
    <div class="cloud cloud-right cloud-7"></div>
    <div class="cloud cloud-right cloud-8"></div>
  </div>
</template>

<style scoped>
.cloud-parallax-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background-image: url("https://wegjggivvlybwrbjnpcy.supabase.co/storage/v1/object/public/image/cloud.png");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.85;
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4));
}

/* Left clouds */
.cloud-left {
  background-position: left center;
}

/* Right clouds */
.cloud-right {
  background-position: right center;
}

/* ===== Left clouds ===== */
.cloud-1 {
  width: 400px;
  height: 200px;
  top: 2%;
  left: 200px;
  opacity: 0.9;
  animation: cloud-float-1 8s ease-in-out infinite;
}

.cloud-2 {
  width: 300px;
  height: 200px;
  top: 32%;
  left: 30px;
  opacity: 0.7;
  animation: cloud-float-2 10s ease-in-out infinite;
}

.cloud-3 {
  width: 500px;
  height: 300px;
  top: 45%;
  left: 200px;
  opacity: 0.7;
  animation: cloud-float-1 12s ease-in-out infinite;
}

.cloud-4 {
  width: 300px;
  height: 300px;
  top: 65%;
  left: 100px;
  opacity: 0.65;
  animation: cloud-float-2 9s ease-in-out infinite;
}

/* ===== Right clouds ===== */
.cloud-5 {
  width: 450px;
  height: 300px;
  top: 5%;
  right: 300px;
  opacity: 0.85;
  animation: cloud-float-2 9s ease-in-out infinite;
}

.cloud-6 {
  width: 300px;
  height: 300px;
  top: 30%;
  right: 100px;
  opacity: 0.7;
  animation: cloud-float-1 11s ease-in-out infinite;
}

.cloud-7 {
  width: 400px;
  height: 400px;
  top: 35%;
  right: 305px;
  opacity: 0.8;
  animation: cloud-float-2 8s ease-in-out infinite;
}

.cloud-8 {
  width: 600px;
  height: 600px;
  top: 50%;
  right: 30px;
  opacity: 0.65;
  animation: cloud-float-1 10s ease-in-out infinite;
}

/* Float animations for subtle bobbing */
@keyframes cloud-float-1 {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 8px -10px;
  }
}

@keyframes cloud-float-2 {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: -6px 8px;
  }
}

/* Responsive: smaller clouds on mobile */
@media (max-width: 768px) {
  .cloud-1 {
    top: 100px;
    width: 200px;
    height: 200px;
    left: -20px;
  }
  .cloud-2 {
    width: 150px;
    height: 100px;
    left: 50px;
  }
  .cloud-3 {
    width: 120px;
    height: 80px;
    left: -35px;
  }
  .cloud-4 {
    top: 500px;
    width: 400px;
    height: 300px;
    left: -100px;
  }
  .cloud-5 {
    width: 300px;
    height: 300px;
    right: -80px;
  }
  .cloud-6 {
    top: 300px;
    width: 120px;
    height: 80px;
    right: 90px;
  }
  .cloud-7 {
    top: 350px;
    width: 105px;
    height: 72px;
    right: -18px;
  }
  .cloud-8 {
    width: 200px;
    height: 200px;
    right: -30px;
  }
}
</style>
