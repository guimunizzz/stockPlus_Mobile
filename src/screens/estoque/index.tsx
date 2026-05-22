import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, Alert, StyleSheet, ScrollView,
} from 'react-native';
import { db, Estoque, Produto } from '../../database/mockDb';

type FormState = {
  id_produto: string;
  quantidade_atual: string;
};

const EMPTY_FORM: FormState = {
  id_produto: '',
  quantidade_atual: '',
};

export default function EstoqueScreen() {
  const [estoque, setEstoque] = useState<Estoque[]>(db.estoque);
  const [produtos] = useState<Produto[]>(db.produtos);

  const [editModal, setEditModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Estoque | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function getProdutoName(id: number) {
    return produtos.find(p => p.id_produto === id)?.dc_produto ?? '—';
  }

  function getEstoqueMinimo(id: number) {
    return produtos.find(p => p.id_produto === id)?.estoque_minimo ?? 0;
  }

  function formatDate(dt: string) {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setEditModal(true);
  }

  function openEdit(e: Estoque) {
    setEditingId(e.id_estoque);
    setForm({
      id_produto: String(e.id_produto),
      quantidade_atual: String(e.quantidade_atual),
    });
    setEditModal(true);
  }

  function openDetails(e: Estoque) {
    setSelected(e);
    setDetailsModal(true);
  }

  function handleSave() {
    const idProduto = parseInt(form.id_produto) || 0;
    const quantidade = parseInt(form.quantidade_atual);

    if (!idProduto || isNaN(quantidade) || quantidade < 0) {
      Alert.alert('Erro', 'Preencha o produto e a quantidade corretamente.');
      return;
    }

    const agora = new Date().toISOString();

    if (editingId !== null) {
      setEstoque(prev =>
        prev.map(e =>
          e.id_estoque === editingId
            ? { ...e, id_produto: idProduto, quantidade_atual: quantidade, dt_ultima_atualizacao: agora }
            : e
        )
      );
      Alert.alert('Sucesso', 'Estoque atualizado.');
    } else {
      const novo: Estoque = {
        id_estoque: Date.now(),
        id_produto: idProduto,
        quantidade_atual: quantidade,
        dt_ultima_atualizacao: agora,
      };
      setEstoque(prev => [...prev, novo]);
      Alert.alert('Sucesso', 'Estoque adicionado.');
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
          setEstoque(prev => prev.filter(e => e.id_estoque !== id));
          Alert.alert('Sucesso', 'Estoque excluído.');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Text style={styles.addButtonText}>+ Adicionar Estoque</Text>
      </TouchableOpacity>

      <FlatList
        data={estoque}
        keyExtractor={item => String(item.id_estoque)}
        renderItem={({ item }) => {
          const minimo = getEstoqueMinimo(item.id_produto);
          const baixo = item.quantidade_atual < minimo;
          return (
            <View style={styles.card}>
              <View style={[styles.statusBar, baixo ? styles.statusBaixo : styles.statusOk]} />
              <View style={styles.info}>
                <Text style={styles.productName}>{getProdutoName(item.id_produto)}</Text>
                <Text style={styles.productMeta}>
                  Quantidade: {item.quantidade_atual} {baixo ? '(Abaixo do mínimo)' : ''}
                </Text>
                <Text style={styles.productMeta}>Atualizado: {formatDate(item.dt_ultima_atualizacao)}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openDetails(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id_estoque)}
                  style={[styles.actionBtn, styles.deleteBtn]}
                >
                  <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Modal Criar / Editar */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingId !== null ? 'Editar Estoque' : 'Novo Estoque'}
            </Text>
            <ScrollView>
              <Text style={styles.hint}>
                Produtos: {produtos.map(p => `${p.id_produto}=${p.dc_produto}`).join(', ')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ID do Produto"
                value={form.id_produto}
                onChangeText={v => setForm(f => ({ ...f, id_produto: v }))}
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Quantidade atual"
                value={form.quantidade_atual}
                onChangeText={v => setForm(f => ({ ...f, quantidade_atual: v }))}
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
            <Text style={styles.modalTitle}>Detalhes do Estoque</Text>
            {selected && (
              <>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Produto: </Text>
                  <Text style={styles.detailValue}>{getProdutoName(selected.id_produto)}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantidade atual: </Text>
                  <Text style={styles.detailValue}>{selected.quantidade_atual}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estoque mínimo: </Text>
                  <Text style={styles.detailValue}>{getEstoqueMinimo(selected.id_produto)}</Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status: </Text>
                  <Text style={[
                    styles.detailValue,
                    selected.quantidade_atual < getEstoqueMinimo(selected.id_produto)
                      ? styles.statusTextBaixo
                      : styles.statusTextOk
                  ]}>
                    {selected.quantidade_atual < getEstoqueMinimo(selected.id_produto) ? 'Abaixo do mínimo' : 'Normal'}
                  </Text>
                </Text>
                <Text style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Última atualização: </Text>
                  <Text style={styles.detailValue}>{formatDate(selected.dt_ultima_atualizacao)}</Text>
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
  statusBar: { width: 4, borderRadius: 4, marginRight: 10 },
  statusOk: { backgroundColor: '#22c55e' },
  statusBaixo: { backgroundColor: '#dc2626' },
  info: { flex: 1, justifyContent: 'center' },
  productName: { fontWeight: '600', fontSize: 14, color: '#111827' },
  productMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
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
  statusTextBaixo: { color: '#dc2626' },
  statusTextOk: { color: '#22c55e' },
});
