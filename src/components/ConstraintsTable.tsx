
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConstraintsTableProps {
  numProducts: number;
  numResources: number;
  constraints: {
    coefficients: number[][];
    bounds: number[];
    operators: string[];
  };
  onConstraintsChange: (constraints: any) => void;
}

const ConstraintsTable = ({ 
  numProducts, 
  numResources, 
  constraints, 
  onConstraintsChange 
}: ConstraintsTableProps) => {
  
  const handleCoefficientChange = (resourceIndex: number, productIndex: number, value: string) => {
    const newConstraints = { ...constraints };
    newConstraints.coefficients[resourceIndex][productIndex] = parseFloat(value) || 0;
    onConstraintsChange(newConstraints);
  };

  const handleBoundChange = (resourceIndex: number, value: string) => {
    const newConstraints = { ...constraints };
    newConstraints.bounds[resourceIndex] = parseFloat(value) || 0;
    onConstraintsChange(newConstraints);
  };

  const handleOperatorChange = (resourceIndex: number, operator: string) => {
    const newConstraints = { ...constraints };
    newConstraints.operators[resourceIndex] = operator;
    onConstraintsChange(newConstraints);
  };

  const getResourceLabel = (index: number) => {
    const labels = ["Machine (heures)", "Matière (kg)", "Main d'œuvre (h)", "Stockage (m³)", "Budget (€)"];
    return labels[index] || `Ressource ${index + 1}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Étape 3
          </Badge>
          Contraintes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Ressource</th>
                {Array.from({ length: numProducts }, (_, i) => (
                  <th key={i} className="text-center p-3 font-medium text-muted-foreground">
                    Produit {i + 1}
                  </th>
                ))}
                <th className="text-center p-3 font-medium text-muted-foreground">Opérateur</th>
                <th className="text-center p-3 font-medium text-muted-foreground">
                  Capacité disponible
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numResources }, (_, resourceIndex) => (
                <tr key={resourceIndex} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">
                    {getResourceLabel(resourceIndex)}
                  </td>
                  {Array.from({ length: numProducts }, (_, productIndex) => (
                    <td key={productIndex} className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={constraints.coefficients[resourceIndex]?.[productIndex] || 0}
                        onChange={(e) => handleCoefficientChange(resourceIndex, productIndex, e.target.value)}
                        className="text-center font-mono w-20"
                      />
                    </td>
                  ))}
                  <td className="p-3">
                    <Select
                      value={constraints.operators[resourceIndex] || "≤"}
                      onValueChange={(value) => handleOperatorChange(resourceIndex, value)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="≤">≤</SelectItem>
                        <SelectItem value="≥">≥</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      step="0.01"
                      value={constraints.bounds[resourceIndex] || 0}
                      onChange={(e) => handleBoundChange(resourceIndex, e.target.value)}
                      className="text-center font-mono w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstraintsTable;
