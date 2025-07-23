import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MoreVertical,
  Plus,
  Search,
  Users,
  CheckCircle,
  Clock,
  Edit3,
  Trash2,
} from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import { cn } from '@/lib/utils';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="border-none shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [projectsRes, customersRes] = await Promise.all([
        axios.get('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProjects(projectsRes.data);
      setFilteredProjects(projectsRes.data);
      setCustomers(customersRes.data);
      setError('');
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((p) => {
      const customer = customers.find((c) => c._id === p.customerId);
      return (
        customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        p.status.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredProjects(filtered);
  }, [search, projects, customers]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      setError('Error deleting project');
    }
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const pending = projects.filter((p) => p.status === 'pending').length;
    const ongoing = projects.filter((p) => p.status === 'ongoing').length;
    const completed = projects.filter((p) => p.status === 'completed').length;
    return { total, pending, ongoing, completed };
  }, [projects]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your ongoing and completed projects.
          </p>
        </div>
        <Button onClick={() => setEditingProject({})}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total" value={stats.total} color="text-blue-500" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="text-amber-500" />
        <StatCard icon={CheckCircle} label="Ongoing" value={stats.ongoing} color="text-sky-500" />
        <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="text-emerald-500" />
      </div>

      {/* Modal */}
      <Dialog open={!!editingProject} onOpenChange={(o) => !o && setEditingProject(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject?._id ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={() => {
              setEditingProject(null);
              fetchData();
            }}
            onCancel={() => setEditingProject(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Project List</CardTitle>
            <CardDescription>
              Showing {filteredProjects.length} of {projects.length} projects
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>

        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No projects found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Milestones</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const customer = customers.find((c) => c._id === project.customerId);
                  const statusColor =
                    project.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : project.status === 'ongoing'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-emerald-100 text-emerald-800';

                  return (
                    <TableRow key={project._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{customer ? customer.name : 'Unknown'}</TableCell>
                      <TableCell>
                        <span className={cn('px-2 py-1 rounded text-sm font-medium', statusColor)}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell>{project.milestones.join(', ') || 'None'}</TableCell>
                      <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the project for{' '}
                                  {customer ? customer.name : 'Unknown'}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(project._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

Projects.propTypes = {};

export default Projects;
