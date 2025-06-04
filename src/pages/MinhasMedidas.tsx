
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, TrendingUp, TrendingDown, Minus, Ruler, Weight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Medida {
  id: string;
  data: string;
  peso: number;
  altura: number;
  imc: number;
  peito: number;
  cintura: number;
  quadril: number;
  braco_direito: number;
  braco_esquerdo: number;
  coxa_direita: number;
  coxa_esquerda: number;
  observacoes?: string;
}

const MinhasMedidas: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [novaMedida, setNovaMedida] = useState({
    peso: "",
    altura: "",
    peito: "",
    cintura: "",
    quadril: "",
    braco_direito: "",
    braco_esquerdo: "",
    coxa_direita: "",
    coxa_esquerda: "",
    observacoes: ""
  });

  useEffect(() => {
    // Simular carregamento de medidas
    setTimeout(() => {
      setMedidas([
        {
          id: "1",
          data: "2024-01-15",
          peso: 70.5,
          altura: 175,
          imc: 23.0,
          peito: 95,
          cintura: 80,
          quadril: 90,
          braco_direito: 35,
          braco_esquerdo: 34,
          coxa_direita: 55,
          coxa_esquerda: 54,
          observacoes: "Primeira medição"
        },
        {
          id: "2", 
          data: "2024-02-15",
          peso: 72.0,
          altura: 175,
          imc: 23.5,
          peito: 96,
          cintura: 79,
          quadril: 91,
          braco_direito: 36,
          braco_esquerdo: 35,
          coxa_direita: 56,
          coxa_esquerda: 55,
          observacoes: "Progresso visível"
        },
        {
          id: "3",
          data: "2024-03-15", 
          peso: 73.5,
          altura: 175,
          imc: 24.0,
          peito: 98,
          cintura: 78,
          quadril: 92,
          braco_direito: 37,
          braco_esquerdo: 36,
          coxa_direita: 57,
          coxa_esquerda: 56,
          observacoes: "Bom ganho de massa muscular"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  const calcularIMC = (peso: number, altura: number) => {
    const alturaM = altura / 100;
    return peso / (alturaM * alturaM);
  };

  const handleAdicionarMedida = () => {
    if (!novaMedida.peso || !novaMedida.altura) {
      toast.error("Peso e altura são obrigatórios");
      return;
    }

    const peso = parseFloat(novaMedida.peso);
    const altura = parseFloat(novaMedida.altura);
    const imc = calcularIMC(peso, altura);

    const medida: Medida = {
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      peso,
      altura,
      imc: Math.round(imc * 10) / 10,
      peito: parseFloat(novaMedida.peito) || 0,
      cintura: parseFloat(novaMedida.cintura) || 0,
      quadril: parseFloat(novaMedida.quadril) || 0,
      braco_direito: parseFloat(novaMedida.braco_direito) || 0,
      braco_esquerdo: parseFloat(novaMedida.braco_esquerdo) || 0,
      coxa_direita: parseFloat(novaMedida.coxa_direita) || 0,
      coxa_esquerda: parseFloat(novaMedida.coxa_esquerda) || 0,
      observacoes: novaMedida.observacoes
    };

    setMedidas([...medidas, medida]);
    setShowModal(false);
    setNovaMedida({
      peso: "", altura: "", peito: "", cintura: "", quadril: "",
      braco_direito: "", braco_esquerdo: "", coxa_direita: "", coxa_esquerda: "", observacoes: ""
    });
    toast.success("Medida adicionada com sucesso!");
  };

  const getTendencia = (valores: number[]) => {
    if (valores.length < 2) return null;
    const ultimo = valores[valores.length - 1];
    const penultimo = valores[valores.length - 2];
    const diferenca = ultimo - penultimo;
    
    if (diferenca > 0) return { icon: TrendingUp, color: "text-green-600", valor: `+${diferenca.toFixed(1)}` };
    if (diferenca < 0) return { icon: TrendingDown, color: "text-red-600", valor: diferenca.toFixed(1) };
    return { icon: Minus, color: "text-gray-600", valor: "0" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const dadosGrafico = medidas.map(m => ({
    data: new Date(m.data).toLocaleDateString(),
    peso: m.peso,
    imc: m.imc
  }));

  const pesos = medidas.map(m => m.peso);
  const imcs = medidas.map(m => m.imc);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Medidas</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe sua evolução física ao longo do tempo
          </p>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Medição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Medição</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={novaMedida.peso}
                  onChange={(e) => setNovaMedida({...novaMedida, peso: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="altura">Altura (cm) *</Label>
                <Input
                  id="altura"
                  type="number"
                  value={novaMedida.altura}
                  onChange={(e) => setNovaMedida({...novaMedida, altura: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="peito">Peito (cm)</Label>
                <Input
                  id="peito"
                  type="number"
                  step="0.1"
                  value={novaMedida.peito}
                  onChange={(e) => setNovaMedida({...novaMedida, peito: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cintura">Cintura (cm)</Label>
                <Input
                  id="cintura"
                  type="number"
                  step="0.1"
                  value={novaMedida.cintura}
                  onChange={(e) => setNovaMedida({...novaMedida, cintura: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="quadril">Quadril (cm)</Label>
                <Input
                  id="quadril"
                  type="number"
                  step="0.1"
                  value={novaMedida.quadril}
                  onChange={(e) => setNovaMedida({...novaMedida, quadril: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="braco_direito">Braço Direito (cm)</Label>
                <Input
                  id="braco_direito"
                  type="number"
                  step="0.1"
                  value={novaMedida.braco_direito}
                  onChange={(e) => setNovaMedida({...novaMedida, braco_direito: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="braco_esquerdo">Braço Esquerdo (cm)</Label>
                <Input
                  id="braco_esquerdo"
                  type="number"
                  step="0.1"
                  value={novaMedida.braco_esquerdo}
                  onChange={(e) => setNovaMedida({...novaMedida, braco_esquerdo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="coxa_direita">Coxa Direita (cm)</Label>
                <Input
                  id="coxa_direita"
                  type="number"
                  step="0.1"
                  value={novaMedida.coxa_direita}
                  onChange={(e) => setNovaMedida({...novaMedida, coxa_direita: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="coxa_esquerda">Coxa Esquerda (cm)</Label>
                <Input
                  id="coxa_esquerda"
                  type="number"
                  step="0.1"
                  value={novaMedida.coxa_esquerda}
                  onChange={(e) => setNovaMedida({...novaMedida, coxa_esquerda: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={novaMedida.observacoes}
                  onChange={(e) => setNovaMedida({...novaMedida, observacoes: e.target.value})}
                  placeholder="Digite observações sobre a medição..."
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarMedida}>
                Adicionar Medição
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Weight className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Peso Atual</p>
                  <p className="text-2xl font-bold">
                    {medidas.length > 0 ? `${medidas[medidas.length - 1].peso} kg` : "N/A"}
                  </p>
                </div>
              </div>
              {pesos.length > 1 && (
                <div className={`flex items-center ${getTendencia(pesos)?.color}`}>
                  {React.createElement(getTendencia(pesos)?.icon!, { className: "h-5 w-5 mr-1" })}
                  <span className="text-sm font-medium">{getTendencia(pesos)?.valor}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">IMC Atual</p>
                  <p className="text-2xl font-bold">
                    {medidas.length > 0 ? medidas[medidas.length - 1].imc : "N/A"}
                  </p>
                </div>
              </div>
              {imcs.length > 1 && (
                <div className={`flex items-center ${getTendencia(imcs)?.color}`}>
                  {React.createElement(getTendencia(imcs)?.icon!, { className: "h-5 w-5 mr-1" })}
                  <span className="text-sm font-medium">{getTendencia(imcs)?.valor}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Ruler className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medições</p>
                <p className="text-2xl font-bold">{medidas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      {dadosGrafico.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso e IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} name="Peso (kg)" />
                  <Line type="monotone" dataKey="imc" stroke="#10b981" strokeWidth={2} name="IMC" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Medições */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Medições</CardTitle>
        </CardHeader>
        <CardContent>
          {medidas.length === 0 ? (
            <div className="text-center py-12">
              <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma medição registrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece adicionando sua primeira medição para acompanhar seu progresso.
              </p>
              <Button onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Medição
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {medidas.slice().reverse().map((medida) => (
                <div key={medida.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">
                        {new Date(medida.data).toLocaleDateString()}
                      </h4>
                      {medida.observacoes && (
                        <p className="text-sm text-gray-600 mt-1">{medida.observacoes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <div className="font-medium">{medida.peso} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-500">IMC:</span>
                      <div className="font-medium">{medida.imc}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Peito:</span>
                      <div className="font-medium">{medida.peito} cm</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Cintura:</span>
                      <div className="font-medium">{medida.cintura} cm</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Quadril:</span>
                      <div className="font-medium">{medida.quadril} cm</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Braços:</span>
                      <div className="font-medium">{medida.braco_direito}/{medida.braco_esquerdo} cm</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasMedidas;
