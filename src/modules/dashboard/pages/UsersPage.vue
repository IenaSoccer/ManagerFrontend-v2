<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <div class="select-none">
        <h1 class="text-3xl md:text-4xl font-bold text-black text-center mb-2 animate-fade-in">
          Utenti Registrati
        </h1>
        <p class="text-center font-normal mb-8 text-blue-800 animate-fade-in-delay">
          Gestisci gli utenti registrati
        </p>
      </div>
      <AddUser></AddUser>
      <UsersList></UsersList>
    </div>
  </q-page>
</template>

<script setup lang="ts" name="UsersPage">
import UsersList from 'src/modules/dashboard/components/Users/UsersList.vue';
import AddUser from '../components/Users/AddUser.vue';
</script>
