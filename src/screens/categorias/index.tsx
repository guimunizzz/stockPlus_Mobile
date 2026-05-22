import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, Alert, StyleSheet,
} from 'react-native';
import { db, Categoria } from '../../database/mockDb';

export default function CategoriaScreen() {
  const [categorias, setCategorias] = useState<Categoria[]>(db.categorias);
  const [editModal, setEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');

  function openCreate() {
    setEditingId(null);
    setName('');
    setEditModal(true);
  }

  function openEdit(c: Categoria) {
    setEditingId(c.id_categoria);
    setName(c.dc_categoria);
    setEditModal(true);
  }

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Erro', 'Informe o nome da categoria.');
      return;
    }

    if (editingId !== null) {
      setCategorias(prev =>
        prev.map(c =>
          c.id_categoria === editingId ? { ...c, dc_categoria: name.trim() } : c
        )
      );
      Alert.alert('Sucesso', 'Categoria atualizada.');
    } else {
      setCategorias(prev => [
        ...prev,
        { id_categoria: Date.now(), dc_categoria: name.trim() },
      ]);
      Alert.alert('Sucesso', 'Categoria adicionada.');
    }
    setEditModal(false);
  }

  function handleDelete(id: number) {
    Alert.alert('Confirmar', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => {
          setCategorias(prev => prev.filter(c => c.id_categoria !== id));
          Alert.alert('Sucesso', 'Categoria excluída.');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Text style={styles.addButtonText}>+ Adicionar Categoria</Text>
      </TouchableOpacity>

      <FlatList
        data={categorias}
        keyExtractor={item => String(item.id_categoria)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.categoryName}>{item.dc_categoria}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id_categoria)}
                style={[styles.actionBtn, styles.deleteBtn]}
              >
                <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingId !== null ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da categoria"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // botoes principais e layout geral
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  addButton: { backgroundColor: '#111827', padding: 12, borderRadius: 8, marginBottom: 12 },
  addButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 14 },
  // estilos para cada linha da categoria
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  // estilo do nome da categoria
  categoryName: { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500' },

  // botoes de ação (editar e excluir)
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { backgroundColor: '#f3f4f6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  actionText: { fontSize: 12, color: '#111827' },
  deleteBtn: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#dc2626' },

  // estilos para o modal de edição/criação
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  // estilos para o input do nome da categoria no modal
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    color: '#111827',
  },
  // estilos para os botoes de ação dentro do modal
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelBtn: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' },
  cancelText: { color: '#374151', fontSize: 14 },
  saveBtn: { backgroundColor: '#111827', padding: 10, borderRadius: 8, paddingHorizontal: 20 },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});