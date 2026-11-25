import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles, { colors } from '../shared/Estilo';
import { realizarCalculo } from './Funcoes';

const operations = ['+', '-', '*', '/'];
const operationLabels = { '+': '+', '-': '−', '*': '×', '/': '÷' };

export default function Home({ navigation }) {
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [operacao, setOperacao] = useState('+');
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);

  function calcular() {
    const calculation = realizarCalculo(numero1, numero2, operacao);
    if (calculation.error) {
      setErro(calculation.error);
      setResultado('');
      return;
    }

    setErro('');
    setResultado(calculation.formattedResult);
    setHistorico((current) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          expression: calculation.expression,
          result: calculation.formattedResult,
        },
        ...current,
      ].slice(0, 20),
    );
  }

  function removerCalculo(id) {
    setHistorico((current) => current.filter((item) => item.id !== id));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.forest} />
      <ScrollView
        contentContainerStyle={styles.homePage}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.homeHeader}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹ Sair</Text>
          </Pressable>
          <View style={styles.smallCrest}>
            <Text style={styles.smallCrestLetter}>H</Text>
          </View>
          <Text style={styles.homeEyebrow}>AULA DE ARITMANCIA</Text>
          <Text style={styles.homeTitle}>Calculadora Mágica</Text>
          <Text style={styles.homeSubtitle}>
            Escolha os números e conjure o resultado.
          </Text>
        </View>

        <View style={styles.calculatorCard}>
          <Text style={styles.cardEyebrow}>SEUS NÚMEROS</Text>
          <TextInput
            accessibilityLabel="Primeiro número"
            keyboardType="decimal-pad"
            onChangeText={setNumero1}
            onSubmitEditing={calcular}
            placeholder="Digite o primeiro número"
            placeholderTextColor={colors.placeholder}
            returnKeyType="next"
            style={styles.input}
            value={numero1}
          />
          <TextInput
            accessibilityLabel="Segundo número"
            keyboardType="decimal-pad"
            onChangeText={setNumero2}
            onSubmitEditing={calcular}
            placeholder="Digite o segundo número"
            placeholderTextColor={colors.placeholder}
            returnKeyType="done"
            style={[styles.input, styles.secondNumberInput]}
            value={numero2}
          />

          <Text style={styles.cardEyebrow}>ESCOLHA O FEITIÇO</Text>
          <View style={styles.operations}>
            {operations.map((operation) => {
              const selected = operacao === operation;
              return (
                <Pressable
                  accessibilityLabel={`Operação ${operationLabels[operation]}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  key={operation}
                  onPress={() => setOperacao(operation)}
                  style={[
                    styles.operationButton,
                    selected && styles.operationButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.operationText,
                      selected && styles.operationTextSelected,
                    ]}
                  >
                    {operationLabels[operation]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={calcular}
            style={({ pressed }) => [
              styles.primaryButton,
              styles.calculateButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>✦  Calcular</Text>
          </Pressable>

          {erro ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {erro}
            </Text>
          ) : null}

          {resultado !== '' ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>RESULTADO DO FEITIÇO</Text>
              <Text accessibilityLiveRegion="polite" style={styles.resultText}>
                {resultado}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.historyEyebrow}>PERGAMINHO</Text>
            <Text style={styles.historyTitle}>Histórico de cálculos</Text>
          </View>
          {historico.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setHistorico([])}
              style={styles.clearHistoryButton}
            >
              <Text style={styles.clearHistoryText}>Limpar</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.historyList}>
          {historico.length > 0 ? (
            historico.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historySymbol}>
                  <Text style={styles.historySymbolText}>✦</Text>
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyExpression}>{item.expression}</Text>
                  <Text style={styles.historyResult}>= {item.result}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Remover cálculo ${item.expression}`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => removerCalculo(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Seus cálculos aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
