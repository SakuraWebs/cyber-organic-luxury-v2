import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { Loader2, Trash2, Edit2, Plus, Users, Image as ImageIcon, Save, X } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'user';
  dailyUsage: number;
  maxDailyUsage: number;
  lastUsageDate: string;
}

interface ProjectData {
  id: string;
  title: string;
  category: string;
  image: string;
  desc: string;
  alt: string;
  link: string;
  fullDesc: string;
  client: string;
  year: string;
  services: string[];
  gallery: string[];
  createdAt: string;
}

export default function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'portfolio'>('users');

  // Users State
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editMaxUsage, setEditMaxUsage] = useState<number>(4);

  // Portfolio State
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    image: '',
    desc: '',
    alt: '',
    link: '',
    fullDesc: '',
    client: '',
    year: '',
    services: '',
    gallery: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          setIsAdmin(true);
          fetchUsers();
          fetchProjects();
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData: ProjectData[] = [];
      querySnapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() } as ProjectData);
      });
      // Sort by createdAt descending
      projectsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleUpdateUserLimit = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        maxDailyUsage: editMaxUsage
      });
      setUsers(users.map(u => u.id === userId ? { ...u, maxDailyUsage: editMaxUsage } : u));
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        services: newProject.services.split(',').map(s => s.trim()).filter(Boolean),
        gallery: newProject.gallery.split(',').map(s => s.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      setProjects([{ id: docRef.id, ...projectData }, ...projects]);
      setIsAddingProject(false);
      setNewProject({
        title: '', category: '', image: '', desc: '', alt: '', link: '', fullDesc: '', client: '', year: '', services: '', gallery: ''
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-400">Gestiona usuarios, límites de IA y el portafolio.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-colors ${
              activeTab === 'users' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios y Uso
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-colors ${
              activeTab === 'portfolio' ? 'bg-brand-gold/20 text-brand-gold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Portafolio
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-black/50 text-gray-400 font-mono">
                    <tr>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Rol</th>
                      <th className="px-6 py-4">Uso Hoy</th>
                      <th className="px-6 py-4">Límite Diario</th>
                      <th className="px-6 py-4">Último Uso</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-sm text-xs font-mono uppercase ${u.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">{u.dailyUsage}</td>
                        <td className="px-6 py-4">
                          {editingUserId === u.id ? (
                            <input
                              type="number"
                              min="0"
                              value={editMaxUsage}
                              onChange={(e) => setEditMaxUsage(parseInt(e.target.value) || 0)}
                              className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-brand-cyan"
                            />
                          ) : (
                            u.maxDailyUsage ?? 4
                          )}
                        </td>
                        <td className="px-6 py-4">{u.lastUsageDate}</td>
                        <td className="px-6 py-4 text-right">
                          {editingUserId === u.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleUpdateUserLimit(u.id)} className="text-green-400 hover:text-green-300">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingUserId(null)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditMaxUsage(u.maxDailyUsage ?? 4);
                              }}
                              className="text-brand-cyan hover:text-brand-cyan/80"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-white">Proyectos</h2>
              <button
                onClick={() => setIsAddingProject(!isAddingProject)}
                className="flex items-center gap-2 bg-brand-cyan text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
              >
                {isAddingProject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAddingProject ? 'Cancelar' : 'Nuevo Proyecto'}
              </button>
            </div>

            {isAddingProject && (
              <div className="bg-white/5 border border-brand-cyan/30 p-6 rounded-xl mb-8">
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Título</label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={e => setNewProject({...newProject, title: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Categoría</label>
                      <input
                        type="text"
                        required
                        value={newProject.category}
                        onChange={e => setNewProject({...newProject, category: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">URL de la Imagen (Principal)</label>
                      <input
                        type="url"
                        required
                        value={newProject.image}
                        onChange={e => setNewProject({...newProject, image: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Texto Alternativo (Alt)</label>
                      <input
                        type="text"
                        required
                        value={newProject.alt}
                        onChange={e => setNewProject({...newProject, alt: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Link (ej: /portafolio/nuevo)</label>
                      <input
                        type="text"
                        required
                        value={newProject.link}
                        onChange={e => setNewProject({...newProject, link: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Cliente</label>
                      <input
                        type="text"
                        required
                        value={newProject.client}
                        onChange={e => setNewProject({...newProject, client: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Año</label>
                      <input
                        type="text"
                        required
                        value={newProject.year}
                        onChange={e => setNewProject({...newProject, year: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Servicios (separados por coma)</label>
                      <input
                        type="text"
                        required
                        value={newProject.services}
                        onChange={e => setNewProject({...newProject, services: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Galería (URLs separadas por coma)</label>
                      <input
                        type="text"
                        value={newProject.gallery}
                        onChange={e => setNewProject({...newProject, gallery: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Descripción Corta</label>
                      <textarea
                        required
                        rows={2}
                        value={newProject.desc}
                        onChange={e => setNewProject({...newProject, desc: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Descripción Completa</label>
                      <textarea
                        required
                        rows={4}
                        value={newProject.fullDesc}
                        onChange={e => setNewProject({...newProject, fullDesc: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-cyan outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-brand-cyan text-black px-6 py-2 rounded-lg font-bold uppercase text-sm hover:bg-white transition-colors">
                      Guardar Proyecto
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={project.image.includes('http') || project.image.match(/\.(webp|jpg|jpeg|png|svg|gif)$/i) ? project.image : `${project.image}.webp`} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-mono text-brand-gold uppercase mb-1">{project.category}</div>
                    <h3 className="text-lg font-serif text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.desc}</p>
                  </div>
                </div>
              ))}
              {projects.length === 0 && !isAddingProject && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No hay proyectos en el portafolio.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
