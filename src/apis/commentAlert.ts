// import { supabase } from '@/libs/supabase';

// export const commentsAlert = async () => {
//   await supabase
//     .channel('comments-alarm')
//     .on(
//       'postgres_changes',
//       {
//         schema: 'public', // Subscribes to the "public" schema in Postgres
//         event: '*', // Listen to all changes
//         table: 'comments',
//       },
//       (payload) => console.log(payload),
//     )
//     .subscribe();
// };

// commentsAlert();
