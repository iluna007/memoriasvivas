/**
 * Videos del mapa, de 3 playlists de YouTube del proyecto, cada uno ya anclado
 * a su territorio real (T1-T5 de src/data/CMS/territorio.js).
 *
 * Playlists de origen:
 * - "Conversaciones en Golfito" (T1): https://www.youtube.com/playlist?list=PLGHT070Rxh6qPV-wuAPjvKglHW4RxASwn
 * - "Conversaciones en Rancho Quemado, Osa" (T2): https://www.youtube.com/playlist?list=PLGHT070Rxh6qyRHurW2khdkMW5jcse1aF
 * - "Conversaciones en la Península de Osa" (mixta, asignada video por video): https://www.youtube.com/playlist?list=PLGHT070Rxh6rtGSLLZn4F6jSZW-mb0XAf
 *
 * Para agregar un video nuevo a una playlist: agregarlo aquí a mano con su
 * territorioId correspondiente (T1-T5, ver src/data/CMS/territorio.js).
 */
export const MAPA_VIDEOS_PLAYLISTS = [
  // --- Golfito (T1) ---
  { id: 'KWStjtwbjM0', title: 'Conversación con Hellen Mora', territorioId: 'T1' },
  { id: 'OpzqnZy12WI', title: 'Entrevista a Virginia García Cabrera', territorioId: 'T1' },
  { id: 'TYPXQ1o2iD0', title: 'Entrevista a Lila González Valdés y Cecilia Castro González', territorioId: 'T1' },
  { id: 'J8eg3it77rk', title: 'Entrevista a Norma Paquita Jiménez Rojas', territorioId: 'T1' },
  { id: 'c5uVhrqO6uM', title: 'Interview with Virginia Miranda Cabezas', territorioId: 'T1' },

  // --- Rancho Quemado (T2) ---
  { id: 'C80hAHrpEqE', title: 'Conversación con Alice y Félix', territorioId: 'T2' },
  { id: 'SHnLzf6TFus', title: 'Conversation with Eraida Muñoz and Sérbulo Sandoval', territorioId: 'T2' },
  { id: 'xIqQHM9tLBc', title: 'Conversación con Alice Castro', territorioId: 'T2' },
  { id: 'GmzlNtjDS5U', title: 'Conversation with Ismael Carvajal', territorioId: 'T2' },
  { id: 'X9abyt-oWYA', title: 'Conversation with Jeremiah Ureña', territorioId: 'T2' },
  { id: 'Rh_poGMBFAo', title: 'Conversation with Delfín Ureña', territorioId: 'T2' },
  { id: 'qXwiTlk8AeU', title: 'Conversation with José Trino Ureña Granados', territorioId: 'T2' },
  { id: 'udEB2-xChm4', title: 'Conversaciones y recorrido de monitoreo biológico comunitario con Familia Ureña - Rodríguez Ureña', territorioId: 'T2' },
  { id: 'LpC4WmnoBBw', title: 'Entrevista a Yolanda Rodríguez. Miembro del Grupo de monitoreo biológico de Rancho Quemado', territorioId: 'T2' },
  { id: '3O1ybuQbXQs', title: 'Entrevista Juan Cubillo', territorioId: 'T2' },
  { id: 'Q--2cluo1Rc', title: 'Entrevista y recorrido de monitoreo biológico comunitario con Familia Ureña', territorioId: 'T2' },

  // --- La Palma (T3) ---
  { id: 'jAr7565ncpg', title: 'Entrevista a Alexander Solórzano Leíton - OSACOOP', territorioId: 'T3' },
  { id: 'sKo_-J4HAtA', title: 'Conversación con Catalina Arias Carmona y Eida Fletes', territorioId: 'T3' },

  // --- Los Charcos (T4) ---
  { id: 'xgHeXx6Srv4', title: 'Reinaldo Aguilar Interview in Los Charcos', territorioId: 'T4' },

  // --- Puerto Jiménez (T5) ---
  { id: 'DcOnZ26Bb6I', title: 'Reinaldo Aguilar Entrevista en Casa Botánica, Puerto Jimenez', territorioId: 'T5' },
]
