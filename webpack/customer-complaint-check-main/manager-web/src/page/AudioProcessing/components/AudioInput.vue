<template>
  <a-card title="输入音频" :bordered="false">
    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane key="url" tab="音频URL">
        <a-form layout="vertical" @submit.prevent="handleUrlSubmit">
          <a-form-item label="音频URL">
            <a-input
              v-model:value="audioUrl"
              placeholder="请输入音频文件的URL"
              :disabled="loading"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              :disabled="!audioUrl.trim()"
            >
              处理音频URL
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="file" tab="本地文件">
        <a-form layout="vertical" @submit.prevent="handleFileSubmit">
          <a-form-item label="选择音频文件">
            <a-upload
              :max-count="1"
              accept="audio/*"
              :before-upload="beforeUpload"
              :file-list="fileList"
              @remove="handleRemove"
            >
              <a-button :disabled="loading">
                <upload-outlined />
                选择文件
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              :disabled="fileList.length === 0"
            >
              处理音频文件
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';

interface Props {
  loading?: boolean;
}

interface Emits {
  (e: 'process-url', url: string): void;
  (e: 'process-file', file: File): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTab = ref<string>('url');
const audioUrl = ref<string>('');
const fileList = ref<UploadProps['fileList']>([]);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  fileList.value = [file];
  return false;
};

const handleRemove = () => {
  fileList.value = [];
};

const handleUrlSubmit = () => {
  if (audioUrl.value.trim()) {
    emit('process-url', audioUrl.value.trim());
  }
};

const handleFileSubmit = () => {
  if (fileList.value && fileList.value.length > 0) {
    const file = fileList.value[0] as any;
    const actualFile = file.originFileObj || file;
    if (actualFile) {
      emit('process-file', actualFile);
    }
  }
};
</script>

<style scoped lang="scss">
.ant-card {
  margin-bottom: 24px;
}
</style>
