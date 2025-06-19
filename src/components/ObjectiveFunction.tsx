
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ObjectiveFunctionProps {
  numProducts: number;
  coefficients: number[];
  onCoefficientsChange: (coeffs: number[]) => void;
}

const ObjectiveFunction = ({ numProducts, coefficients, onCoefficientsChange }: ObjectiveFunctionProps) => {
  const handleCoefficientChange = (index: number, value: string) => {
    const newCoeffs = [...coefficients];
    newCoeffs[index] = parseFloat(value) || 0;
    onCoefficientsChange(newCoeffs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Étape 2
          </Badge>
          Fonction Objectif (Bénéfice par produit)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: numProducts }, (_, i) => (
            <div key={i} className="space-y-2">
              <Label htmlFor={`product-${i}`} className="text-sm font-medium">
                Produit {i + 1}
              </Label>
              <Input
                id={`product-${i}`}
                type="number"
                step="0.01"
                value={coefficients[i] || 0}
                onChange={(e) => handleCoefficientChange(i, e.target.value)}
                className="text-center font-mono"
                placeholder="0"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Fonction objectif à maximiser :</p>
          <div className="font-mono text-lg text-center">
            Z = {coefficients.map((coeff, i) => 
              `${coeff}x${i + 1}`
            ).join(' + ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectiveFunction;
