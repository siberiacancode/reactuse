<script setup lang="ts">
import type { Spec } from 'comment-parser';
import { isDefaultType } from '../utils/isDefaultType';

const props = defineProps<{
  apiParameters: Spec[];
}>();

type Group = {
  id: number;
  parameters: Spec[];
  returns: Spec | null;
};

let groupIndex = 0;
const groups: Group[] = [{ id: groupIndex, parameters: [], returns: null }];

props.apiParameters.forEach((parameter, index) => {
  if (parameter.tag === 'overload') {
    const isFirstOverload =
      props.apiParameters.findIndex((parameter) => parameter.tag === 'overload') === index;
    if (!isFirstOverload) {
      groupIndex++;
      groups.push({ id: groupIndex, parameters: [], returns: null });
    }
    return;
  }

  if (parameter.tag === 'returns') {
    groups[groupIndex].returns = parameter;
    return;
  }

  groups[groupIndex].parameters.push(parameter);
});
</script>

<template>
  <div v-for="group in groups" :key="group.id">
    <h3 v-if="group.parameters.length">Parameters</h3>
    <table v-if="group.parameters.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in group.parameters" :key="parameter.name">
          <td>{{ parameter.name }}{{ parameter.optional ? '?' : '' }}</td>

          <td v-if="isDefaultType(parameter.type)">
            {{ parameter.type }}
          </td>
          <td v-else>
            <a href="#">{{ parameter.type }}</a>
          </td>

          <td>
            {{ parameter.default ?? '-' }}
          </td>
          <td>{{ parameter.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="group.returns">
      <h3>Returns</h3>
      <p v-if="isDefaultType(group.returns.type)">
        <code>{{ group.returns.type }}</code>
      </p>
      <p v-else>
        <a href="#">
          <code>{{ group.returns.type }}</code>
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
td:nth-child(2) {
  white-space: nowrap;
}
</style>
