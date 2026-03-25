<template>
  <q-page class="admin-page q-pa-md">
    <div class="row justify-between items-center q-mb-lg page-header">
      <div>
        <h2 class="text-white font-cinzel q-my-none">Panel Administrador</h2>
        <p class="text-grey-4 q-mb-none q-mt-sm">Gestión de usuarios y accesos</p>
      </div>
      <q-btn
        color="accent"
        text-color="dark"
        icon="person_add"
        label="Nuevo Usuario"
        class="mystic-btn"
        unelevated
        rounded
        @click="openDialog()"
      />
    </div>

    <!-- Users Table -->
    <q-card class="mystic-card" flat>
      <q-table
        :rows="users"
        :columns="columns"
        row-key="uid"
        :loading="loadingUsers"
        dark
        flat
        class="bg-transparent text-white"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.role === 'ADMIN_ROLE' ? 'accent' : 'primary'"
              :text-color="props.row.role === 'ADMIN_ROLE' ? 'dark' : 'white'"
              class="q-pa-xs text-weight-bold"
            >
              {{ props.row.role === 'ADMIN_ROLE' ? 'ADMIN' : 'USER' }}
            </q-badge>
          </q-td>
        </template>
        
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.estado === 'activo' ? 'positive' : 'warning'"
              class="q-pa-xs"
            >
              {{ props.row.estado.toUpperCase() }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-pagos="props">
          <q-td :props="props">
            <div v-if="props.row.pagos && props.row.pagos.length > 0">
              <q-badge color="teal" class="q-pa-xs q-mr-xs">
                {{ props.row.pagos.length }} pago(s)
              </q-badge>
              <span class="text-grey-4 text-caption">
                Último: {{ formatDate(props.row.pagos[0].fecha_pago) }}
              </span>
            </div>
            <span v-else class="text-grey-6 text-caption">Sin pagos</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round color="info" icon="edit" size="sm" @click="openDialog(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat round size="sm"
              :icon="props.row.estado === 'activo' ? 'toggle_on' : 'toggle_off'"
              :color="props.row.estado === 'activo' ? 'positive' : 'warning'"
              @click="toggleStatus(props.row)"
            >
              <q-tooltip>{{ props.row.estado === 'activo' ? 'Desactivar' : 'Activar' }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- User Modal (Add/Edit) -->
    <q-dialog v-model="userDialog" persistent>
      <q-card class="mystic-card" style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-cinzel text-white">
            {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-4" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit.prevent="saveUser" class="q-gutter-md">
            <q-input
              v-model="userForm.nombre"
              label="Nombre completo"
              dark
              outlined
              color="grey-4"
              :rules="[val => !!val || 'El nombre es requerido']"
            />
            
            <q-input
              v-model="userForm.email"
              type="email"
              label="Correo electrónico"
              dark
              outlined
              color="grey-4"
              :rules="[
                val => !!val || 'El correo es requerido',
                val => /.+@.+\..+/.test(val) || 'Ingresa un correo válido'
              ]"
            />

            <q-input
              v-model="userForm.password"
              :type="showPassword ? 'text' : 'password'"
              :label="isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'"
              dark
              outlined
              color="grey-4"
              :rules="isEditing ? [] : [val => val.length >= 6 || 'Mínimo 6 caracteres']"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-input
              v-model="userForm.fecha_nacimiento"
              type="date"
              label="Fecha de nacimiento"
              dark
              outlined
              color="grey-4"
              :rules="[val => !!val || 'La fecha es requerida']"
            />

            <q-select
              v-model="userForm.role"
              :options="['USER_ROLE', 'ADMIN_ROLE']"
              label="Rol"
              dark
              outlined
              color="grey-4"
            />

            <q-select
              v-model="userForm.estado"
              :options="['activo', 'inactivo']"
              label="Estado"
              dark
              outlined
              color="grey-4"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancelar" color="grey-7" flat v-close-popup class="q-mr-sm" />
              <q-btn
                type="submit"
                :label="isEditing ? 'Guardar Cambios' : 'Crear Usuario'"
                color="accent"
                text-color="dark"
                :loading="savingUser"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import api from '../services/api';

const $q = useQuasar();

const users = ref([]);
const loadingUsers = ref(false);
const savingUser = ref(false);

const userDialog = ref(false);
const isEditing = ref(false);
const showPassword = ref(false);

const userForm = ref({
  uid: null,
  nombre: '',
  email: '',
  password: '',
  fecha_nacimiento: '',
  role: 'USER_ROLE',
  estado: 'inactivo'
});

const columns = [
  { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'email', required: true, label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'role', align: 'center', label: 'Rol', field: 'role', sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
  { name: 'pagos', align: 'left', label: 'Pagos', field: 'pagos' },
  { name: 'actions', align: 'right', label: 'Acciones', field: 'actions' }
];

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const { data } = await api.get('/users');
    users.value = data.users;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar usuarios' });
  } finally {
    loadingUsers.value = false;
  }
};

const openDialog = (user = null) => {
  if (user) {
    isEditing.value = true;
    userForm.value = {
      uid: user.uid,
      nombre: user.nombre,
      email: user.email,
      password: '', // Password is not returned by the backend
      fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
      role: user.role,
      estado: user.estado
    };
  } else {
    isEditing.value = false;
    userForm.value = {
      uid: null,
      nombre: '',
      email: '',
      password: '',
      fecha_nacimiento: '',
      role: 'USER_ROLE',
      estado: 'inactivo'
    };
  }
  showPassword.value = false;
  userDialog.value = true;
};

const saveUser = async () => {
  savingUser.value = true;
  try {
    const payload = { ...userForm.value };
    if (!payload.password) {
      delete payload.password;
    }

    if (isEditing.value) {
      await api.put(`/users/${payload.uid}`, payload);
      $q.notify({ type: 'positive', message: 'Usuario actualizado correctamente' });
    } else {
      await api.post('/users', payload);
      $q.notify({ type: 'positive', message: 'Usuario creado exitosamente' });
    }
    
    userDialog.value = false;
    fetchUsers();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.msg || 'Error al guardar el usuario'
    });
  } finally {
    savingUser.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const toggleStatus = async (user) => {
  const accion = user.estado === 'activo' ? 'desactivar' : 'activar';
  $q.dialog({
    title: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Usuario`,
    message: `¿Estás seguro de que deseas ${accion} la cuenta de ${user.nombre}?`,
    cancel: { flat: true, label: 'Cancelar' },
    ok: { color: user.estado === 'activo' ? 'warning' : 'positive', label: accion.charAt(0).toUpperCase() + accion.slice(1), flat: true },
    dark: true
  }).onOk(async () => {
    try {
      const { data } = await api.patch(`/users/${user.uid}/toggle-status`);
      $q.notify({ type: 'positive', message: data.msg });
      fetchUsers();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al cambiar estado del usuario' });
    }
  });
};

onMounted(fetchUsers);
</script>

<style lang="scss" scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
