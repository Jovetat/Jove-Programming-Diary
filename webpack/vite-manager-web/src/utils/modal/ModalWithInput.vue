<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    v-bind="modalProps"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <EveryForm
      ref="formRef"
      v-model="formData"
      class="modal-input-form"
      :form-options="formOptions"
      :form-props="formProps"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EveryForm from '@/components/EveryForm/index.vue';
import type { FormOption } from '@/components/EveryForm/types';

interface Props {
  title?: string;
  okText?: string;
  cancelText?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  maxLength?: number;
  defaultValue?: string; // 输入框默认值
  inputType?: 'input' | 'textarea'; // 输入框类型：普通输入框或文本域
  modalProps?: Record<string, any>;
  onOk?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  destroy?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  okText: '确定',
  cancelText: '取消',
  inputLabel: '请输入',
  inputPlaceholder: '请输入内容',
  maxLength: 50,
  defaultValue: '',
  inputType: 'input',
  modalProps: () => ({}),
  onOk: undefined,
  onCancel: undefined,
  destroy: () => {},
});

const formProps = {
  rules: {
    inputValue: [
      { required: true, message: props.inputPlaceholder, trigger: 'blur' },
    ],
  },
};

const formOptions: FormOption[] = [
  {
    type: props.inputType === 'textarea' ? 'Textarea' : 'Input',
    label: props.inputLabel,
    dataIndex: 'inputValue',
    span: 24,
    comProps: {
      placeholder: props.inputPlaceholder,
      maxlength: props.maxLength,
      ...(props.inputType === 'textarea' ? { rows: 4, showCount: true } : {}),
    },
  },
];

const visible = ref(false);
const formRef = ref<any>(null);
const formData = ref({
  inputValue: '',
});

const handleOk = async () => {
  const { success, data } = await formRef.value.submit();
  if (success) {
    if (props.onOk) {
      props.onOk(data.inputValue.trim());
    }
    close();
  }
};

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel();
  }
  close();
};

const close = () => {
  visible.value = false;
  props.destroy();
};

onMounted(() => {
  visible.value = true;
  // 设置默认值
  if (props.defaultValue) {
    formData.value.inputValue = props.defaultValue;
  }
});
</script>

<style scoped lang="scss">
.modal-input-form {
  display: block;
}
</style>
