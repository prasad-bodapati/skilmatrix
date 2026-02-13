const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) {
      throw new Error(`Server error (${res.status})`);
    }
    return {};
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  return data;
}

export async function login(email: string, password: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, fullName: string, role: string) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, fullName, role }),
  });
}

export async function verify(email: string, code: string) {
  return request('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function setPassword(email: string, password: string, securityQuestion: string, securityAnswer: string) {
  return request('/auth/set-password', {
    method: 'POST',
    body: JSON.stringify({ email, password, securityQuestion, securityAnswer }),
  });
}

export async function resetPassword(email: string, securityAnswer: string, newPassword: string) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, securityAnswer, newPassword }),
  });
}

export async function getSecurityQuestion(email: string) {
  return request(`/auth/security-question?email=${encodeURIComponent(email)}`);
}

export async function getAdminDashboard() {
  return request('/dashboard/admin');
}

export async function getSkillsMatrix() {
  return request('/dashboard/skills-matrix');
}

export async function getDeveloperDashboard(userId: number) {
  return request(`/dashboard/developer/${userId}`);
}

export async function getTeams() {
  return request('/teams');
}

export async function getProjects(teamId: number) {
  return request(`/teams/${teamId}/projects`);
}

export async function getComponents(projectId: number) {
  return request(`/projects/${projectId}/components`);
}

export async function getQuestions(componentId: number) {
  return request(`/components/${componentId}/questions`);
}

export async function getUsers() {
  return request('/users');
}

export async function getUserLevels(userId: number) {
  return request(`/users/${userId}/levels`);
}

export async function getUserAttempts(userId: number) {
  return request(`/users/${userId}/attempts`);
}

export async function getUserInvites(userId: number) {
  return request(`/users/${userId}/invites`);
}

export async function getAssessments() {
  return request('/assessments');
}

export async function getPendingReviews() {
  return request('/assessments/pending-review');
}

export async function inviteUser(email: string, fullName: string, role: string, projectId: number) {
  return request('/auth/invite', {
    method: 'POST',
    body: JSON.stringify({ email, fullName, role, projectId }),
  });
}

export async function createAssessmentInvite(developerId: number, assessmentId: number) {
  return request('/assessments/invite', {
    method: 'POST',
    body: JSON.stringify({ developerId, assessmentId }),
  });
}

export async function startAttempt(inviteId: number) {
  return request(`/assessments/start/${inviteId}`, { method: 'POST' });
}

export async function submitAttempt(attemptId: number, answers: { questionId: number; answer: string }[]) {
  return request(`/assessments/submit/${attemptId}`, {
    method: 'POST',
    body: JSON.stringify(answers),
  });
}

export async function gradeAnswer(answerId: number, correct: boolean) {
  return request('/assessments/grade', {
    method: 'POST',
    body: JSON.stringify({ answerId, correct }),
  });
}
