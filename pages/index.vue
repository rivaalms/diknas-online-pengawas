<template>
   <v-container fluid>
      <data-table
         :headers="tableHeaders"
         :items="data.data"
         :total-page="data.last_page"
         :current-page="data.current_page"
         :from="data.from"
         :to="data.to"
         :total="data.total"
         :loading="loading"
         @data-handler="(current, status_id, school_id, category_id, data_type_id) => dataHandler(current, status_id, school_id, category_id, data_type_id)"
      />
   </v-container>
</template>

<script>
import dataTable from '~/pages/components/table'

export default {
   name: 'IndexPage',

   components: { dataTable },

   data() {
      return {
         user: this.$auth.user,

         tableHeaders: [
            {
               text: 'Nama Sekolah',
               value: 'school.name'
            },
            {
               text: 'Tipe data',
               value: 'data_type.name',
            },
            {
               text: 'Kategori',
               sortable: false,
               value: 'data_category.name',
            },
            {
               text: 'Tahun ajaran',
               value: 'year',
            },
            {
               text: 'Status',
               sortable: false,
               value: 'data_status.name',
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions',
            },
         ],
         data: [],
         loading: true,
      }
   },

   async mounted() {
      await this.$axios.get(`/supervisor/getData/${this.user.id}`).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, categoryId, dataTypeId) {
         this.loading = true
         this.$axios.get(`/supervisor/getData/${this.user.id}`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               category: categoryId,
               data_type: categoryId ? dataTypeId : null,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   }
}
</script>
