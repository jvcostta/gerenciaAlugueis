import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Property, PropertyUnit } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: property || {
      name: '',
      address: '',
      type: 'apartment',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      description: '',
      status: 'vacant'
    }
  });
  
  const [units, setUnits] = useState<Omit<PropertyUnit, 'id' | 'propertyId'>[]>(
    property?.units?.map(unit => ({
      unitNumber: unit.unitNumber,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      area: unit.area,
      monthlyRent: unit.monthlyRent,
      status: unit.status,
      tenantId: unit.tenantId
    })) || []
  );
  
  const { addProperty, updateProperty } = useAppContext();
  const propertyType = watch('type');
  
  const addUnit = () => {
    setUnits([...units, {
      unitNumber: '',
      bedrooms: 1,
      bathrooms: 1,
      area: 50,
      monthlyRent: 1000,
      status: 'vacant'
    }]);
  };
  
  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };
  
  const updateUnit = (index: number, field: string, value: any) => {
    const updatedUnits = [...units];
    updatedUnits[index] = { ...updatedUnits[index], [field]: value };
    setUnits(updatedUnits);
  };
  
  const onSubmit = (data: any) => {
    const propertyData = {
      ...data,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area: Number(data.area),
      units: (propertyType === 'building' || propertyType === 'lot') ? units : undefined
    };
    
    if (property) {
      updateProperty({ ...property, ...propertyData });
    } else {
      addProperty(propertyData);
    }
    onClose();
  };

  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'building', label: 'Prédio/Condomínio' },
    { value: 'lot', label: 'Lote' }
  ];

  const showUnits = propertyType === 'building' || propertyType === 'lot';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Ex: Edifício Central, Casa da Praia"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <input
          type="text"
          {...register('address', { required: 'Endereço é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Rua, número, bairro, cidade"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {propertyTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!showUnits && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quartos</label>
            <input
              type="number"
              {...register('bedrooms', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Banheiros</label>
            <input
              type="number"
              {...register('bathrooms', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
            <input
              type="number"
              {...register('area', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {showUnits && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Unidades ({propertyType === 'building' ? 'Apartamentos' : 'Lotes'})
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={addUnit}
            >
              Adicionar Unidade
            </Button>
          </div>
          
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {units.map((unit, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Unidade {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => removeUnit(index)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Número/Identificação
                    </label>
                    <input
                      type="text"
                      value={unit.unitNumber}
                      onChange={(e) => updateUnit(index, 'unitNumber', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Ex: 101, A, Lote 1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Aluguel (R$)
                    </label>
                    <input
                      type="number"
                      value={unit.monthlyRent}
                      onChange={(e) => updateUnit(index, 'monthlyRent', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Quartos</label>
                    <input
                      type="number"
                      value={unit.bedrooms}
                      onChange={(e) => updateUnit(index, 'bedrooms', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Banheiros</label>
                    <input
                      type="number"
                      value={unit.bathrooms}
                      onChange={(e) => updateUnit(index, 'bathrooms', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Área (m²)</label>
                    <input
                      type="number"
                      value={unit.area}
                      onChange={(e) => updateUnit(index, 'area', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Status</label>
                    <select
                      value={unit.status}
                      onChange={(e) => updateUnit(index, 'status', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="vacant">Vaga</option>
                      <option value="occupied">Ocupada</option>
                      <option value="maintenance">Manutenção</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Descrição adicional da propriedade..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="vacant">Vaga</option>
          <option value="occupied">Ocupada</option>
          <option value="maintenance">Manutenção</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {property ? 'Atualizar' : 'Adicionar'} Propriedade
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;