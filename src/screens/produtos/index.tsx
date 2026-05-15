import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, Alert, StyleSheet, Image, ScrollView,
} from 'react-native';
import { db, Produto, Categoria, Fornecedor } from '../../database/mockDb';

type FormState = {
  dc_produto: string;
  preco: string;
  vinculo_imagem: string;
  estoque_minimo: string;
  id_categoria: string;
  id_fornecedor: string;
};

const EMPTY_FORM: FormState = {
  dc_produto: '',
  preco: '',
  vinculo_imagem: '',
  estoque_minimo: '',
  id_categoria: '',
  id_fornecedor: '',
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(db.produtos);
  const [categorias] = useState<Categoria[]>(db.categorias);
  const [fornecedores] = useState<Fornecedor[]>(db.fornecedores);

  const [editModal, setEditModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Produto | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function getCategoryName(id: number) {
    return categorias.find(c => c.id_categoria === id)?.dc_categoria ?? '—';
  }

  function getFornecedorName(id: number) {
    return fornecedores.find(f => f.id_fornecedor === id)?.dc_fornecedor ?? '—';
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setEditModal(true);
  }

  function openEdit(p: Produto) {
    setEditingId(p.id_produto);
    setForm({
      dc_produto: p.dc_produto,
      preco: String(p.preco),
      vinculo_imagem: p.vinculo_imagem,
      estoque_minimo: String(p.estoque_minimo),
      id_categoria: String(p.id_categoria),
      id_fornecedor: String(p.id_fornecedor),
    });
    setEditModal(true);
  }

  function openDetails(p: Produto) {
    setSelected(p);
    setDetailsModal(true);
  }

  function handleSave() {
    const preco = parseFloat(form.preco.replace(',', '.'));
    if (!form.dc_produto.trim() || isNaN(preco)) {
      Alert.alert('Erro', 'Preencha nome e preço corretamente.');
      return;
    }

    const estoqueMinimo = parseInt(form.estoque_minimo) || 0;
    const idCategoria = parseInt(form.id_categoria) || 0;
    const idFornecedor = parseInt(form.id_fornecedor) || 0;

    if (editingId !== null) {
      setProdutos(prev =>
        prev.map(p =>
          p.id_produto === editingId
            ? { ...p, dc_produto: form.dc_produto.trim(), preco, vinculo_imagem: form.vinculo_imagem, estoque_minimo: estoqueMinimo, id_categoria: idCategoria, id_fornecedor: idFornecedor }
            : p
        )
      );
      Alert.alert('Sucesso', 'Produto atualizado.');
    } else {
      const novo: Produto = {
        id_produto: Date.now(),
        dc_produto: form.dc_produto.trim(),
        vinculo_imagem: form.vinculo_imagem || 'https://via.placeholder.com/150',
        preco,
        estoque_minimo: estoqueMinimo,
        id_categoria: idCategoria,
        id_fornecedor: idFornecedor,
      };
      setProdutos(prev => [...prev, novo]);
      Alert.alert('Sucesso', 'Produto adicionado.');
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
          setProdutos(prev => prev.filter(p => p.id_produto !== id));
          Alert.alert('Sucesso', 'Produto excluído.');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={item => String(item.id_produto)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.vinculo_imagem }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.productName}>{item.dc_produto}</Text>
              <Text style={styles.productMeta}>{getCategoryName(item.id_categoria)}</Text>
              <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openDetails(item)} style={styles.actionBtn}>
                <Text style={styles.actionText}>Detalhes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id_produto)}
                style={[styles.actionBtn, styles.deleteBtn]}
              >
                <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal Criar / Editar */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingId !== null ? 'Editar Produto' : 'Novo Produto'}
            </Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Nome do produto"
                value={form.dc_produto}
                onChangeText={v => setForm(f => ({ ...f, dc_produto: v }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Preço (ex: 25.50)"
                value={form.preco}
                onChangeText={v => setForm(f => ({ ...f, preco: v }))}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="URL da imagem"
                value={form.vinculo_imagem}
                onChangeText={v => setForm(f => ({ ...f, vinculo_imagem: v }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Estoque mínimo"
                value={form.estoque_minimo}
                onChangeText={v => setForm(f => ({ ...f, estoque_minimo: v }))}
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                Categorias: {categorias.map(c => `${c.id_categoria}=${c.dc_categoria}`).join(', ')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ID Categoria"
                value={form.id_categoria}
                onChangeText={v => setForm(f => ({ ...f, id_categoria: v }))}
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                Fornecedores: {fornecedores.map(f => `${f.id_fornecedor}=${f.dc_fornecedor}`).join(', ')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ID Fornecedor"
                value={form.id_fornecedor}
                onChangeText={v => setForm(f => ({ ...f, id_fornecedor: v }))}
                keyboardType="number-pad"
              />
            </ScrollView>
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

      {/* Modal Detalhes */}
      <Modal visible={detailsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Detalhes do Produto</Text>
            {selected && (
              <>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nome: </Text>
                  <Text style={styles.detailValue}>{selected.dc_produto}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Preço: </Text>
                  <Text style={styles.detailValue}>R$ {selected.preco.toFixed(2)}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Categoria: </Text>
                  <Text style={styles.detailValue}>{getCategoryName(selected.id_categoria)}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fornecedor: </Text>
                  <Text style={styles.detailValue}>{getFornecedorName(selected.id_fornecedor)}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estoque mínimo: </Text>
                  <Text style={styles.detailValue}>{selected.estoque_minimo}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Imagem: </Text>
                  <Text style={styles.detailValue} numberOfLines={2}>{selected.vinculo_imagem}</Text>
                </Text>
              </>
            )}
            <TouchableOpacity
              onPress={() => setDetailsModal(false)}
              style={[styles.saveBtn, { marginTop: 16, alignSelf: 'stretch' }]}
            >
              <Text style={[styles.saveText, { textAlign: 'center' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  addButton: { backgroundColor: '#111827', padding: 12, borderRadius: 8, marginBottom: 12 },
  addButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: { width: 60, height: 60, borderRadius: 6, marginRight: 10, backgroundColor: '#f3f4f6' },
  info: { flex: 1, justifyContent: 'center' },
  productName: { fontWeight: '600', fontSize: 14, color: '#111827' },
  productMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  productPrice: { fontSize: 13, color: '#111827', marginTop: 2 },
  actions: { justifyContent: 'center', gap: 4 },
  actionBtn: { backgroundColor: '#f3f4f6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  actionText: { fontSize: 12, color: '#111827' },
  deleteBtn: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#dc2626' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    color: '#111827',
  },
  hint: { fontSize: 11, color: '#9ca3af', marginBottom: 4, marginTop: -2 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' },
  cancelText: { color: '#374151', fontSize: 14 },
  saveBtn: { backgroundColor: '#111827', padding: 10, borderRadius: 8, paddingHorizontal: 20 },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  detailRow: { marginBottom: 8 },
  detailLabel: { fontSize: 13, color: '#6b7280' },
  detailValue: { fontSize: 13, color: '#111827', fontWeight: '500' },
});