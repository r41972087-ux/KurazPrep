import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Markdown, { MarkdownProps } from 'react-native-markdown-display';
import { colors } from '../core/theme/colors';

interface Props {
  children: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ children }) => {
  return (
    <Markdown
      style={markdownStyles}
      // Future: integrate react-native-math-view plugin for LaTeX rendering
    >
      {children}
    </Markdown>
  );
};

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryLight,
    marginTop: 16,
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
  blockquote: {
    backgroundColor: colors.background,
    borderLeftColor: colors.secondary,
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    borderRadius: 4,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    borderRadius: 8,
  }
});
