import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PassengerDetailsView from '../views/PassengerDetailsView.vue';
import AirlineDetailsView from '../views/AirlineDetailsView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import Resource from '@/views/Resource.vue'; // 确保您有这个组件
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import axios, { AxiosError } from 'axios';
import { usePassengerStore } from '@/stores/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/passengers/:id',
      name: 'passengerDetails',
      component: PassengerDetailsView,
      beforeEnter: async (to, from, next) => {
        
        
        const passengerStore = usePassengerStore();
        
        try {
          const response = await axios.get(`https://api.instantwebtools.net/v1/passenger/${to.params.id}`); 
          passengerStore.setPassenger(response.data);
          next();
        } catch (error) { // 使用 'any' 类型来允许类型守卫
          if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as AxiosError;
            console.error('Failed to fetch passenger details:', axiosError);
            if (axiosError.response && axiosError.response.status === 404) {
              console.log("Navigating to Resource component due to 404 error");
              next({ name: 'resource' }); 
            } else {
              next({ name: 'not-found' }); 
            }
          } else {
            console.error('Non-Axios error caught:', error);
            next({ name: 'not-found' }); 
          }
        }
      },
    },
    {
      path: '/airlines/:id',
      name: 'airlineDetails',
      component: AirlineDetailsView,
    },
    {
      path: '/passengers/111111',
      name: 'resource',
      component: Resource, 
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView, 
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    
    console.log('Saved Position:',savedPosition);  
   if (savedPosition) {
     return savedPosition
   } else {
     return { behavior: 'auto',top: 0 }
   }
      
     }
});

router.beforeEach(() => {
  nprogress.start();
});

router.afterEach(() => {
  nprogress.done();
});

export default router;
