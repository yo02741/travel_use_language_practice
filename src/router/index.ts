import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/scenario/:id",
      name: "scenario",
      component: () => import("@/views/ScenarioView.vue"),
    },
    {
      path: "/scenario/:id/phrase/:n",
      name: "phrase",
      component: () => import("@/views/PhraseView.vue"),
    },
    {
      path: "/scenario/:id/dialog/:n",
      name: "dialog",
      component: () => import("@/views/DialogView.vue"),
    },
    {
      path: "/kana",
      name: "kana",
      component: () => import("@/views/KanaHomeView.vue"),
    },
    {
      path: "/kana/:type",
      name: "kana-practice",
      component: () => import("@/views/KanaPracticeView.vue"),
    },
    {
      path: "/kana/quiz",
      name: "kana-quiz",
      component: () => import("@/views/KanaQuizView.vue"),
    },
    {
      path: "/kana/chart",
      name: "kana-chart",
      component: () => import("@/views/KanaChartView.vue"),
    },
  ],
});

export default router;
