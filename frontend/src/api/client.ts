// client.ts
export const API_BASE = 'http://localhost:3000/api';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS E INTERFACES (SQA)
// ─────────────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Estudiante' | 'Mentor' | 'Gestor' | 'Mentorizado';
}

export interface MentorProfile {
  id: number;
  mentorPerfilId: number;
  name: string;
  role: string;
  bio: string;
  tags: string[];
  init: string;
  color: string;
  sessions: number;
  rating: string;
}

export interface Sesion {
  id: number;
  estudianteId?: number;
  mentorId: number;
  fecha: string;
  hora: string;
  duracion: string;
  objetivo: string;
  estado: string;
}

export interface Evaluacion {
  id: number;
  usuarioId: number;
  scores: Record<string, number>;
  indiceEmpleabilidad: number;
  createdAt: string;
}

export interface Compromiso {
  id: number;
  descripcion: string;
  completado: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('tutortic_token');
}

function buildHeaders(auth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

interface FetchResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function apiFetch<T>(url: string, options: RequestInit, isProtected = false): Promise<FetchResult<T>> {
  if (isProtected && !getToken()) {
    return { ok: false, error: 'No autorizado. Inicia sesión.' };
  }
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { ok: false, error: errBody.error || `Error HTTP: ${res.status}` };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Error de red' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, pass: string): Promise<FetchResult<{ token: string, usuario: User }>> {
  return apiFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ correo: email, password: pass })
  });
}

export async function apiRegister(data: any): Promise<FetchResult<{ token: string, usuario: User }>> {
  const payload = {
    nombre: data.nombres + (data.apellidos ? ' ' + data.apellidos : ''),
    correo: data.email,
    password: data.pass,
    rol: data.rol
  };
  return apiFetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTORES
// ─────────────────────────────────────────────────────────────────────────────
export async function apiGetMentores(): Promise<FetchResult<{ mentores: MentorProfile[] }>> {
  return apiFetch(`${API_BASE}/mentores`, {
    method: 'GET',
    headers: buildHeaders()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SESIONES
// ─────────────────────────────────────────────────────────────────────────────
export async function apiGetSesiones(): Promise<FetchResult<{ sesiones: Sesion[] }>> {
  return apiFetch(`${API_BASE}/sesiones/me`, {
    method: 'GET',
    headers: buildHeaders(true)
  }, true);
}

export async function apiAgendarSesion(data: Partial<Sesion>): Promise<FetchResult<{ sesion: Sesion }>> {
  return apiFetch(`${API_BASE}/sesiones`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(data)
  }, true);
}

export async function apiActualizarEstadoSesion(id: number, estado: string): Promise<FetchResult<{ sesion: Sesion }>> {
  return apiFetch(`${API_BASE}/sesiones/${id}/estado`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify({ estado })
  }, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUACIONES
// ─────────────────────────────────────────────────────────────────────────────
export async function apiSaveEvaluacion(data: { scores: Record<string, number>, indiceEmpleabilidad: number }): Promise<FetchResult<{ evaluacion: Evaluacion }>> {
  return apiFetch(`${API_BASE}/evaluaciones`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(data)
  }, true);
}

export async function apiGetEvaluacion(): Promise<FetchResult<{ evaluacion: Evaluacion }>> {
  return apiFetch(`${API_BASE}/evaluaciones/me`, {
    method: 'GET',
    headers: buildHeaders(true)
  }, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPROMISOS
// ─────────────────────────────────────────────────────────────────────────────
export async function apiGetCompromisos(): Promise<FetchResult<{ compromisos: Compromiso[] }>> {
  return apiFetch(`${API_BASE}/compromisos/me`, {
    method: 'GET',
    headers: buildHeaders(true)
  }, true);
}

export async function apiSaveCompromiso(descripcion: string): Promise<FetchResult<{ compromiso: Compromiso }>> {
  return apiFetch(`${API_BASE}/compromisos`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ descripcion })
  }, true);
}

export async function apiActualizarEstadoCompromiso(id: number, completado: boolean): Promise<FetchResult<{ compromiso: Compromiso }>> {
  return apiFetch(`${API_BASE}/compromisos/${id}/estado`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify({ completado })
  }, true);
}

export async function apiDeleteCompromiso(id: number): Promise<FetchResult<{ message: string }>> {
  return apiFetch(`${API_BASE}/compromisos/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true)
  }, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// VACANTES
// ─────────────────────────────────────────────────────────────────────────────
export interface Vacante {
  id: number;
  titulo: string;
  empresa: string;
  logo: string;
  tags: string[];
}

export async function apiGetVacantes(): Promise<FetchResult<{ vacantes: Vacante[] }>> {
  return apiFetch(`${API_BASE}/vacantes`, {
    method: 'GET',
    headers: buildHeaders(true)
  }, true);
}

export async function apiPostularVacante(id: number, data: { 
  cartaPresentacion: string; 
  cvUrl: string; 
  pretension?: number; 
  disponibilidad?: string; 
}): Promise<FetchResult<{ message: string }>> {
  return apiFetch(`${API_BASE}/vacantes/${id}/postular`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(data)
  }, true);
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFILES
// ─────────────────────────────────────────────────────────────────────────────
export interface StudentProfile {
  id: number;
  usuarioId: number;
  bio?: string;
  intereses?: string;
  telefono?: string;
}

export interface MentorExtraProfile {
  id: number;
  usuarioId: number;
  bio?: string;
  especialidad?: string;
  telefono?: string;
  categorias?: { nombre: string }[];
}

export async function apiGetPerfil(): Promise<FetchResult<{ usuario: User, perfil: StudentProfile | MentorExtraProfile | null }>> {
  return apiFetch(`${API_BASE}/perfil/me`, {
    method: 'GET',
    headers: buildHeaders(true)
  }, true);
}

export async function apiUpdatePerfil(data: {
  nombre?: string;
  bio?: string;
  telefono?: string;
  especialidad?: string;
  intereses?: string;
  tags?: string[];
}): Promise<FetchResult<{ message: string, usuario: User, perfil: any }>> {
  return apiFetch(`${API_BASE}/perfil/me`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(data)
  }, true);
}
